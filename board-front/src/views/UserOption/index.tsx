import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './style.css';
import defaultProfileImage from 'assets/image/default-profile-image.png';
import { useNavigate, useParams } from 'react-router-dom';
import { MAIN_PATH, USER_PATH } from 'constant';
import { useLoginUserStore } from 'stores';
import { fileUploadRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest } from 'apis';
import { GetUserResponseDto, PatchNicknameResponseDto, PatchProfileImageResponseDto } from 'apis/response/user';
import { ResponseDto } from 'apis/response';
import { PatchNicknameRequestDto, PatchProfileImageRequestDto } from 'apis/request/user';
import { useCookies } from 'react-cookie';

//          component : 유저 설정 화면 컴포넌트         //
export default function UserSetting() {

    const { userEmail } = useParams();
    const { loginUser } = useLoginUserStore();
    const [cookies] = useCookies();
    const [isMyPage, setMyPage] = useState<boolean>(false);
    const navigate = useNavigate();

    //          component : 유저 설정 편집 컴포넌트         //
    const UserSettingTop = () => {
        const imageInputRef = useRef<HTMLInputElement | null>(null);
        const [isNicknameChange, setNicknameChange] = useState<boolean>(false);
        const [nickname, setNickname] = useState<string>('');
        const [changeNickname, setChangeNickname] = useState<string>('');
        const [profileImage, setProfileImage] = useState<string | null>(null);

        const getUserResponse = (responseBody: GetUserResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') {
              navigate(MAIN_PATH());
              return;
            }
      
            const { email, nickname, profileImage } = responseBody as GetUserResponseDto;
            setNickname(nickname);
            setProfileImage(profileImage);
            const isMyPage = email === loginUser?.email;
            setMyPage(isMyPage);
          };
      
          const fileUploadResponse = (profileImage: string | null) => {
            if (!profileImage || !cookies.accessToken) return;
            const requestBody: PatchProfileImageRequestDto = { profileImage };
            patchProfileImageRequest(requestBody, cookies.accessToken).then(patchProfileImageResponse);
          }
      
          const patchProfileImageResponse = (responseBody: PatchProfileImageResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'AF') alert('인증에 실패했습니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;
            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
          };
      
          const patchNicknameResponse = (responseBody: PatchNicknameResponseDto | ResponseDto | null) => {
            if (!responseBody) return;
            const { code } = responseBody;
            if (code === 'VF') alert('닉네임은 필수입니다.');
            if (code === 'AF') alert('인증에 실패했습니다.');
            if (code === 'DN') alert('중복되는 닉네임입니다.');
            if (code === 'NU') alert('존재하지 않는 유저입니다.');
            if (code === 'DBE') alert('데이터베이스 오류입니다.');
            if (code !== 'SU') return;
            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
          };
      
          const onProfileBoxClickHandler = () => {
            if (!isMyPage || !imageInputRef.current) return;
            imageInputRef.current.click();
          };
      
          const onNicknameEditButtonClickHandler = () => {
            if (!isNicknameChange) {
              setChangeNickname(nickname);
              setNicknameChange(true);
              return;
            }
            if (!cookies.accessToken) return;
            const requestBody: PatchNicknameRequestDto = { nickname: changeNickname };
            patchNicknameRequest(requestBody, cookies.accessToken).then(patchNicknameResponse);
          };
      
          const onProfileImageChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || !event.target.files.length) return;
            const file = event.target.files[0];
            const data = new FormData();
            data.append('file', file);
            fileUploadRequest(data).then(fileUploadResponse);
          };
      
          const onNicknameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            setChangeNickname(event.target.value);
          };
      
          useEffect(() => {
            if (!userEmail) return;
            getUserRequest(userEmail).then(getUserResponse);
          }, [userEmail]);
          
        //          render : 유서 설정 편집 렌더링          //
        return (
            <div id = 'user-setting-top'>
            <div className='user-setting-top-title'>프로필 편집</div>
                <div className='user-setting-top-profile' >
                    <div className='user-setting-image-box'></div>
                    <div className='user-setting-info'></div>
                    <div className='user-setting-image-button'></div>
                </div>
            <div className='user-setting-top-nickname'></div>
            <div className='user-setting-top-button'></div>
            </div>)
    }

    //          component : 유저 탈퇴 컴포넌트         //
    const UserSettingBottom = () => {

        //          render : 유서 탈퇴 렌더링          //
        return (
            <div id = 'user-setting bottom'>
                <div className='user-setting-bottom-title'>회원 탈퇴</div>
                <div className='user-setting-bottom-warn-box'></div>
                <div className='user-setting-bottom-button'></div>
            </div>
        )
    }

    //          render : 유서 설정 화면 렌더링          //
    return (
        <div id = 'user-setting-wrapper'>
            <div className='user-setting-container'>
                <UserSettingTop />
                <UserSettingBottom />
            </div>
        </div>
    )
}
