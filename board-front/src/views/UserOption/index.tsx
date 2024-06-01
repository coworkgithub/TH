import './style.css';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from 'constant';
import { deleteUserRequest, fileUploadRequest, getUserRequest, patchNicknameRequest, patchProfileImageRequest } from 'apis';
import { useLoginUserStore } from 'stores';
import { useCookies } from 'react-cookie';


//          component : 유저 설정 화면 컴포넌트         //
export default function UserSetting() {

    //          component : 유저 설정 편집 컴포넌트         //
    const UserSettingTop = () => {

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
    //    state: 로그인 유지 상태    //
    const { loginUser, resetLoginUser } = useLoginUserStore();
          
    //    state: 쿠키 상태     //
    const [cookies, setCookie] = useCookies();

    //    function: 네비게이트 함수    //
    const navigate = useNavigate();

    const onDeleteUserButtonClickHandler = async () => {
      const confirmDelete = window.confirm('정말로 회원 탈퇴를 하시겠습니까?');
      if (!confirmDelete) return;

      if (!loginUser || !cookies.accessToken) return;

      const response = await deleteUserRequest(loginUser.email, cookies.accessToken);
      if (response && response.code === 'SU') {
          alert('회원 탈퇴가 완료되었습니다.');
          // 로그아웃 처리
          resetLoginUser();
          setCookie('accessToken', '', {path:MAIN_PATH(), expires: new Date() })
          navigate(MAIN_PATH()); // 로그인 페이지로 리다이렉트 예제
      } else {
          alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
  };

        //          render : 유서 탈퇴 렌더링          //
        return (
            <div id = 'user-setting bottom'>
              <div className='user-setting-bottom-title'>회원 탈퇴</div>
              <div className='user-setting-bottom-warn-box'>탈퇴 시 모든 정보가 삭제됩니다.</div>
              <button className='user-setting-bottom-button' onClick={onDeleteUserButtonClickHandler}>회원 탈퇴</button>
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
